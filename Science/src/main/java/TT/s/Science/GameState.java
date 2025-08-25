package TT.s.Science;

import java.util.ArrayList;
import java.util.Arrays;

public class GameState {

    public fieldState[][] board;

    public int numOfChildren;

    public GameState[] next;

    public GameState(){
        numOfChildren = 0;
        board = new fieldState[3][3];
        next = new GameState[0];
    }

    public boolean checkWin(){
        boolean firstRow = this.board[0][0] == this.board[0][1] && this.board[0][0] == this.board[0][2];
        boolean secondRow = this.board[1][0] == this.board[1][1] && this.board[1][0] == this.board[1][2];
        boolean thirdRow = this.board[2][0] == this.board[2][1] && this.board[2][0] == this.board[2][2];
        boolean firstColumn = this.board[0][0] == this.board[1][0] && this.board[0][0] == this.board[2][0];
        boolean secondColumn = this.board[0][1] == this.board[1][1] && this.board[0][1] == this.board[2][1];
        boolean thirdColumn = this.board[0][2] == this.board[1][2] && this.board[0][2] == this.board[2][2];
        boolean mainDiagonal = this.board[0][0] == this.board[1][1] && this.board[0][0] == this.board[2][2];
        boolean secondaryDiagonal = this.board[0][2] == this.board[1][1] && this.board[0][2] == this.board[2][0];

        if(firstRow && this.board[0][0] != fieldState.EMPTY) return true;
        if(secondRow && this.board[1][0] != fieldState.EMPTY) return true;
        if(thirdRow && this.board[2][0] != fieldState.EMPTY) return true;
        if(firstColumn && this.board[0][0] != fieldState.EMPTY) return true;
        if(secondColumn && this.board[0][1] != fieldState.EMPTY) return true;
        if(thirdColumn && this.board[0][2] != fieldState.EMPTY) return true;
        if(mainDiagonal && this.board[0][0] != fieldState.EMPTY) return true;
        if(secondaryDiagonal && this.board[0][2] != fieldState.EMPTY) return true;
        return false;
    }

    public void print(){
        for(int i = 0; i < 3; i++){
            for(int j = 0; j < 3; j++){
                if(this.board[i][j] == fieldState.CROS) System.out.print("|x");
                if(this.board[i][j] == fieldState.CIRCLE) System.out.print("|o");
                if(this.board[i][j] == fieldState.EMPTY) System.out.print("| ");
            }
            System.out.print("\n");
        }
        System.out.print("\n");
    }

    public int buildTree(fieldState currPlayer, int num){
        num+=1;
        if(this.checkWin()){
            this.next = null;
        }
        else{
            int counter = 0;
            for(int i = 0; i < 3; i++){
                for(int j = 0; j < 3; j++){
                    if(this.board[i][j] == fieldState.EMPTY) counter++;
                }
            }

            if(counter == 0){
                this.next = null;
            }
            else{
                this.next = new GameState[counter];
                this.numOfChildren = counter;
                int helper = 0;
                for(int i = 0; i < 3; i++){
                    for(int j = 0; j < 3; j++){
                        if(this.board[i][j] == fieldState.EMPTY){
                            this.next[helper] = new GameState();

                            for(int k = 0; k < 3; k++){
                                for(int z = 0; z < 3; z++){
                                    fieldState aid = this.board[k][z];
                                    this.next[helper].board[k][z] = aid;
                                }
                            }

                            this.next[helper].board[i][j] = currPlayer;
                            if(currPlayer == fieldState.CROS) num = this.next[helper].buildTree(fieldState.CIRCLE, num);
                            else num = this.next[helper].buildTree(fieldState.CROS, num);
                            helper++;
                        }
                    }
                }
            }
        }
        return num;
    }

    public Skup equalStates(){
        ArrayList<fieldState> helper = new ArrayList<>();
        for(fieldState[] s : this.board){
            helper.addAll(Arrays.asList(s));
        }
        Skup states = new Skup();
        fieldState[][] help;
        help = new fieldState[3][3];
        help[0][0] = helper.get(0);
        help[0][1] = helper.get(1);
        help[0][2] = helper.get(2);
        help[1][0] = helper.get(3);
        help[1][1] = helper.get(4);
        help[1][2] = helper.get(5);
        help[2][0] = helper.get(6);
        help[2][1] = helper.get(7);
        help[2][2] = helper.get(8);
        states.add(help);
        for(int i = 0; i < 3; i++){ //rotacije
            help[0][0] = helper.get((i % 3 == 0 ? 6 : (i % 3 == 1 ? 8 : 2)));
            help[0][1] = helper.get((i % 3 == 0 ? 3 : (i % 3 == 1 ? 7 : 5)));
            help[0][2] = helper.get((i % 3 == 0 ? 0 : (i % 3 == 1 ? 6 : 8)));
            help[1][0] = helper.get((i % 3 == 0 ? 7 : (i % 3 == 1 ? 5 : 1)));
            help[1][1] = helper.get(4);
            help[1][2] = helper.get((i % 3 == 0 ? 1 : (i % 3 == 1 ? 3 : 7)));
            help[2][0] = helper.get((i % 3 == 0 ? 8 : (i % 3 == 1 ? 2 : 0)));
            help[2][1] = helper.get((i % 3 == 0 ? 5 : (i % 3 == 1 ? 1 : 3)));
            help[2][2] = helper.get((i % 3 == 0 ? 2 : (i % 3 == 1 ? 0 : 6)));
            states.add(help);
        }
        for(int i = 0; i < 2; i++){ //zrcaljenje po srednjem stupcu/retku
            help[0][0] = helper.get((i % 2 == 0 ? 2 : 6));
            help[0][1] = helper.get((i % 2 == 0 ? 1 : 7));
            help[0][2] = helper.get((i % 2 == 0 ? 0 : 8));
            help[1][0] = helper.get((i % 2 == 0 ? 5 : 3));
            help[1][1] = helper.get(4);
            help[1][2] = helper.get((i % 2 == 0 ? 3 : 5));
            help[2][0] = helper.get((i % 2 == 0 ? 8 : 0));
            help[2][1] = helper.get((i % 2 == 0 ? 7 : 1));
            help[2][2] = helper.get((i % 2 == 0 ? 6 : 2));
            states.add(help);
        }
        for(int i = 0; i < 2; i++){ //zrcaljenje po dijagonalama
            help[0][0] = helper.get((i % 2 == 0 ? 8 : 0));
            help[0][1] = helper.get((i % 2 == 0 ? 5 : 3));
            help[0][2] = helper.get((i % 2 == 0 ? 2 : 6));
            help[1][0] = helper.get((i % 2 == 0 ? 7 : 1));
            help[1][1] = helper.get(4);
            help[1][2] = helper.get((i % 2 == 0 ? 1 : 7));
            help[2][0] = helper.get((i % 2 == 0 ? 6 : 2));
            help[2][1] = helper.get((i % 2 == 0 ? 3 : 5));
            help[2][2] = helper.get((i % 2 == 0 ? 0 : 8));
            states.add(help);
        }
        return states;
    }

}
